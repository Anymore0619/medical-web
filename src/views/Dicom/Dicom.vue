<template>
  <ProCard class="dicom">
    <div class="w-125 h-125 main"></div>
  </ProCard>
</template>

<script setup lang="ts">
import { init, Enums, RenderingEngine, Types } from '@cornerstonejs/core'
import * as cornerstoneTools from '@cornerstonejs/tools'
import initCornerstone from '@/utils/cornerstone'
import { onMounted } from 'vue'

onMounted(async () => {
  initCornerstone()
  await init()
  await cornerstoneTools.init()

  const { ViewportType } = Enums
  const {
    PanTool,
    WindowLevelTool,
    StackScrollMouseWheelTool,
    ZoomTool,
    PlanarRotateTool,
    ToolGroupManager,
    Enums: csToolsEnums
  } = cornerstoneTools

  const { MouseBindings } = csToolsEnums

  cornerstoneTools.addTool(PanTool)
  cornerstoneTools.addTool(WindowLevelTool)
  cornerstoneTools.addTool(StackScrollMouseWheelTool)
  cornerstoneTools.addTool(ZoomTool)
  cornerstoneTools.addTool(PlanarRotateTool)

  const toolGroupId = 'STACK_TOOL_GROUP_ID'
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId)!

  toolGroup.addTool(WindowLevelTool.toolName)
  toolGroup.addTool(PanTool.toolName)
  toolGroup.addTool(ZoomTool.toolName)
  toolGroup.addTool(StackScrollMouseWheelTool.toolName, { loop: false })
  toolGroup.addTool(PlanarRotateTool.toolName)

  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary
      }
    ]
  })
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary
      }
    ]
  })
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary
      }
    ]
  })
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName)

  const element = document.getElementsByClassName('main')[0] as HTMLDivElement
  element.oncontextmenu = (e) => e.preventDefault()

  const imageIds: string[] = []
  for (let i = 1; i <= 361; i++) {
    imageIds.push(`wadouri:dicom/series-000001/image-${String(i).padStart(6, '0')}.dcm`)
  }

  const renderingEngineId = 'myRenderingEngine'
  const renderingEngine = new RenderingEngine(renderingEngineId)

  const viewportId = 'CT_STACK'
  const viewportInput = {
    viewportId,
    type: ViewportType.STACK,
    element,
    defaultOptions: {
      background: [0.2, 0, 0.2] as Types.Point3
    }
  }

  renderingEngine.enableElement(viewportInput)

  toolGroup.addViewport(viewportId, renderingEngineId)

  const viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport

  viewport.setStack(imageIds)

  // viewport.setProperties({ voiRange: ctVoiRange })

  // cornerstoneTools.utilities.stackPrefetch.enable(viewport.element)

  viewport.render()
})
</script>
